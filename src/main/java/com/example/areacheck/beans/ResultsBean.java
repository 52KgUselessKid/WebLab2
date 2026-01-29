package com.example.areacheck.beans;

import com.example.areacheck.model.ResultEntity;
import jakarta.annotation.PostConstruct;
import jakarta.enterprise.context.SessionScoped;
import jakarta.inject.Named;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.PersistenceUnit;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

@Named("resultsBean")
@SessionScoped
public class ResultsBean implements Serializable {

    @PersistenceUnit(unitName = "areacheckPU")
    private EntityManagerFactory emf;

    private List<ResultEntity> results = new ArrayList<>();

    @PostConstruct
    public void init() {
        EntityManager em = emf.createEntityManager();
        results = em.createQuery("SELECT r FROM ResultEntity r", ResultEntity.class)
                .getResultList();
        em.close();
    }

    public void add(ResultEntity r) {
        EntityManager em = emf.createEntityManager();
        em.getTransaction().begin();
        em.persist(r);
        em.getTransaction().commit();
        em.close();
        results.add(r);
    }

    public List<ResultEntity> getResults() {
        return results;
    }

    public void clear() {
        EntityManager em = emf.createEntityManager();
        em.getTransaction().begin();
        em.createQuery("DELETE FROM ResultEntity").executeUpdate();
        em.getTransaction().commit();
        em.close();
        results.clear();
    }
}